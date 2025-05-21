
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserManagement from '@/components/settings/UserManagement';
import ActivityLogs from '@/components/settings/ActivityLogs';
import { useRole } from '@/contexts/RoleContext';
import { Shield, AlertCircle } from 'lucide-react';

const Settings = () => {
  const { toast } = useToast();
  const { isAdmin, usuario, loading: roleLoading } = useRole();
  const [activeTab, setActiveTab] = useState<string>("company");
  
  // Set users tab as default for admins
  useEffect(() => {
    if (isAdmin) {
      setActiveTab("users");
    }
  }, [isAdmin]);
  
  // Mock function to save settings
  const handleSave = () => {
    toast({
      title: "Configurações salvas",
      description: "As configurações foram atualizadas com sucesso."
    });
  };

  console.log("Is admin:", isAdmin); // Debug log
  console.log("Current user:", usuario); // Debug log

  if (roleLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin h-10 w-10 border-4 border-audti-primary border-t-transparent rounded-full"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Configurações</h1>
          <Button onClick={handleSave}>Salvar Alterações</Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="company">Empresa</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
            <TabsTrigger value="scoring">Pontuação</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            {isAdmin && <TabsTrigger value="users">Usuários</TabsTrigger>}
            {isAdmin && <TabsTrigger value="logs">Logs de Atividades</TabsTrigger>}
          </TabsList>

          <TabsContent value="company" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Empresa</CardTitle>
                <CardDescription>
                  Configure as informações básicas da sua empresa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Nome da Empresa</Label>
                  <Input id="company-name" defaultValue="Grupo Brasal" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-logo">Logo da Empresa</Label>
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-32 bg-gray-100 flex items-center justify-center rounded border">
                      <span className="text-gray-500">Logo</span>
                    </div>
                    <Button variant="outline">Alterar Logo</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-address">Endereço</Label>
                  <Textarea id="company-address" defaultValue="Setor de Indústria e Abastecimento, Trecho 3, Lote 625/695, Brasília-DF" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuração de Relatórios</CardTitle>
                <CardDescription>
                  Personalize a aparência e o conteúdo dos relatórios
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="report-header">Cabeçalho do Relatório</Label>
                  <Textarea id="report-header" defaultValue="Relatório de Auditoria de TI - Grupo Brasal" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="report-footer">Rodapé do Relatório</Label>
                  <Textarea id="report-footer" defaultValue="Confidencial - Uso Interno" />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-photos" defaultChecked />
                  <Label htmlFor="include-photos">Incluir fotos nos relatórios</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-history" defaultChecked />
                  <Label htmlFor="include-history">Incluir histórico de notas</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scoring" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuração de Pontuação</CardTitle>
                <CardDescription>
                  Defina como as notas das auditorias são calculadas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="min-score">Nota Mínima</Label>
                  <Input id="min-score" type="number" min="0" max="5" defaultValue="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-score">Nota Máxima</Label>
                  <Input id="max-score" type="number" min="1" max="10" defaultValue="5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="score-formula">Fórmula de Cálculo</Label>
                  <select 
                    id="score-formula"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue="weighted"
                  >
                    <option value="simple">Média Simples</option>
                    <option value="weighted">Média Ponderada</option>
                    <option value="custom">Fórmula Personalizada</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="zero-impact" defaultChecked />
                  <Label htmlFor="zero-impact">Notas zero impactam mais na média</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuração de Notificações</CardTitle>
                <CardDescription>
                  Configure como e quando as notificações são enviadas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="notify-completed" defaultChecked />
                  <Label htmlFor="notify-completed">Notificar quando auditorias forem concluídas</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="notify-pending" defaultChecked />
                  <Label htmlFor="notify-pending">Notificar sobre auditorias pendentes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="notify-low-score" defaultChecked />
                  <Label htmlFor="notify-low-score">Notificar sobre notas abaixo de 3</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notification-email">Email para Notificações</Label>
                  <Input id="notification-email" type="email" defaultValue="ti@brasal.com.br" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {isAdmin && (
            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gerenciamento de Usuários</CardTitle>
                  <CardDescription>
                    Gerencie os usuários do sistema e suas permissões
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UserManagement />
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {isAdmin && (
            <TabsContent value="logs" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Logs de Atividades</CardTitle>
                  <CardDescription>
                    Visualize o histórico de ações realizadas pelos usuários do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ActivityLogs />
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {!isAdmin && (activeTab === "users" || activeTab === "logs") && (
            <div className="flex flex-col items-center justify-center py-12">
              <Shield className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-700">
                Acesso Restrito
              </h3>
              <p className="text-gray-500 text-center mt-2 max-w-md">
                Você não tem permissão para acessar esta área. 
                Entre em contato com um administrador caso precise de acesso.
              </p>
            </div>
          )}
        </Tabs>

        <div className="flex justify-end">
          <Button onClick={handleSave}>Salvar Alterações</Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
