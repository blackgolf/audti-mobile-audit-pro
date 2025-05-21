import { supabase } from "@/integrations/supabase/client";

export type Usuario = {
  id: string;
  user_id: string;
  nome: string;
  email: string;
  papel: "administrador" | "auditor";
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
};

export type UsuarioFormData = {
  nome: string;
  email: string;
  senha?: string;
  papel: "administrador" | "auditor";
  ativo: boolean;
};

export type LogAtividade = {
  id: string;
  user_id: string;
  usuario_nome: string;
  acao: string;
  detalhes: any;
  criado_em: string;
};

export const usuarioService = {
  // Buscar todos os usuários (apenas administradores)
  async listarUsuarios(): Promise<Usuario[]> {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .order("nome");

    if (error) {
      console.error("Erro ao listar usuários:", error);
      throw error;
    }

    return data as Usuario[];
  },

  // Buscar usuário pelo ID
  async buscarUsuarioPorId(id: string): Promise<Usuario> {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Erro ao buscar usuário:", error);
      throw error;
    }

    return data as Usuario;
  },

  // Buscar usuário atual
  async buscarUsuarioAtual(): Promise<Usuario | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // Usuário autenticado mas não encontrado na tabela de usuários
        return null;
      }
      console.error("Erro ao buscar usuário atual:", error);
      throw error;
    }

    return data as Usuario;
  },

  // Verificar se o usuário atual é administrador
  async verificarAdministrador(): Promise<boolean> {
    try {
      const usuario = await this.buscarUsuarioAtual();
      return usuario !== null && usuario.papel === "administrador" && usuario.ativo;
    } catch (error) {
      return false;
    }
  },

  // Criar um novo usuário (inclui criação na auth e na tabela de usuários)
  async criarUsuario(userData: UsuarioFormData): Promise<Usuario> {
    // Primeiro, criar o usuário no sistema de autenticação
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.senha || Math.random().toString(36).slice(-8), // Senha aleatória se não fornecida
      email_confirm: true // Já confirma o e-mail
    });

    if (authError) {
      console.error("Erro ao criar usuário na autenticação:", authError);
      throw authError;
    }

    // Agora criar o registro na tabela de usuários
    const { data, error } = await supabase
      .from("usuarios")
      .insert({
        user_id: authData.user.id,
        nome: userData.nome,
        email: userData.email,
        papel: userData.papel,
        ativo: userData.ativo
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar registro de usuário:", error);
      // Tentar excluir o usuário da autenticação para não deixar órfão
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw error;
    }

    // Registrar a atividade de criação de usuário
    await this.registrarAtividade("Criação de usuário", {
      usuario_id: data.id,
      usuario_email: userData.email,
      papel: userData.papel
    });

    return data as Usuario;
  },

  // Atualizar um usuário existente
  async atualizarUsuario(id: string, userData: UsuarioFormData): Promise<Usuario> {
    // Primeiro, buscar o usuário para obter o user_id
    const usuario = await this.buscarUsuarioPorId(id);

    // Atualizar o registro na tabela de usuários
    const { data, error } = await supabase
      .from("usuarios")
      .update({
        nome: userData.nome,
        papel: userData.papel,
        ativo: userData.ativo,
        atualizado_em: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Erro ao atualizar usuário:", error);
      throw error;
    }

    // Se uma nova senha foi fornecida, atualizá-la
    if (userData.senha) {
      const { error: authError } = await supabase.auth.admin.updateUserById(
        usuario.user_id,
        { password: userData.senha }
      );
      
      if (authError) {
        console.error("Erro ao atualizar senha:", authError);
        throw authError;
      }
    }

    // Registrar a atividade de atualização de usuário
    await this.registrarAtividade("Atualização de usuário", {
      usuario_id: id,
      usuario_email: userData.email,
      campos_alterados: Object.keys(userData).filter(k => k !== "senha")
    });

    return data as Usuario;
  },

  // Resetar senha do usuário
  async resetarSenha(id: string, novaSenha?: string): Promise<string> {
    // Buscar o usuário para obter o user_id
    const usuario = await this.buscarUsuarioPorId(id);
    
    // Gerar uma senha aleatória se não for fornecida
    const senha = novaSenha || Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase();

    // Atualizar a senha via admin api
    const { error } = await supabase.auth.admin.updateUserById(
      usuario.user_id,
      { password: senha }
    );

    if (error) {
      console.error("Erro ao resetar senha:", error);
      throw error;
    }

    // Registrar a atividade de reset de senha
    await this.registrarAtividade("Reset de senha", {
      usuario_id: id,
      usuario_email: usuario.email
    });

    return senha; // Retornar a senha gerada para que possa ser enviada ao usuário
  },

  // Ativar/desativar um usuário
  async alterarStatusUsuario(id: string, ativo: boolean): Promise<Usuario> {
    const { data, error } = await supabase
      .from("usuarios")
      .update({
        ativo,
        atualizado_em: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Erro ao alterar status do usuário:", error);
      throw error;
    }

    // Registrar a atividade
    await this.registrarAtividade(ativo ? "Ativação de usuário" : "Desativação de usuário", {
      usuario_id: id,
      usuario_email: data.email
    });

    return data as Usuario;
  },

  // Excluir um usuário
  async excluirUsuario(id: string): Promise<void> {
    // Buscar o usuário para obter o user_id e registrar a atividade
    const usuario = await this.buscarUsuarioPorId(id);
    
    // Registrar a atividade antes de excluir
    await this.registrarAtividade("Exclusão de usuário", {
      usuario_id: id,
      usuario_email: usuario.email,
      usuario_nome: usuario.nome
    });

    // Excluir o registro na tabela de usuários
    const { error } = await supabase
      .from("usuarios")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Erro ao excluir registro de usuário:", error);
      throw error;
    }

    // Excluir o usuário da autenticação
    const { error: authError } = await supabase.auth.admin.deleteUser(usuario.user_id);

    if (authError) {
      console.error("Erro ao excluir usuário da autenticação:", authError);
      throw authError;
    }
  },

  // Registrar atividade no log
  async registrarAtividade(acao: string, detalhes: any): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuário não autenticado");

    const usuario = await this.buscarUsuarioAtual();
    if (!usuario) throw new Error("Usuário não encontrado");

    const { error } = await supabase.from("logs_atividades").insert({
      user_id: user.id,
      usuario_nome: usuario.nome,
      acao,
      detalhes
    });

    if (error) {
      console.error("Erro ao registrar atividade:", error);
      // Não lançar erro para não interromper o fluxo principal
    }
  },

  // Listar logs de atividades (apenas administradores)
  async listarLogs(limit = 100): Promise<LogAtividade[]> {
    const { data, error } = await supabase
      .from("logs_atividades")
      .select("*")
      .order("criado_em", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Erro ao listar logs:", error);
      throw error;
    }

    return data as LogAtividade[];
  },
};
