
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Key, Copy, Check } from 'lucide-react';
import { Usuario } from '@/services/usuarioService';

interface PasswordResetDialogProps {
  usuario: Usuario | null;
  isOpen: boolean;
  onClose: () => void;
  onReset: (id: string, senha?: string) => Promise<string>;
}

const PasswordResetDialog: React.FC<PasswordResetDialogProps> = ({
  usuario,
  isOpen,
  onClose,
  onReset,
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState<"input" | "result">("input");

  const handlePasswordReset = async () => {
    if (!usuario) return;
    
    setIsLoading(true);
    try {
      const senha = await onReset(usuario.id, newPassword || undefined);
      setGeneratedPassword(senha);
      setStep("result");
    } catch (error) {
      console.error("Erro ao resetar senha:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setNewPassword("");
    setGeneratedPassword("");
    setStep("input");
    onClose();
  };

  if (!usuario) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {step === "input" ? "Resetar Senha" : "Senha Resetada"}
          </DialogTitle>
          <DialogDescription>
            {step === "input" 
              ? `Resetar a senha para ${usuario.nome} (${usuario.email})`
              : "A senha foi resetada com sucesso. Compartilhe esta senha com o usuário."}
          </DialogDescription>
        </DialogHeader>

        {step === "input" ? (
          <>
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="new-password">
                  Nova Senha (opcional)
                </label>
                <Input
                  id="new-password"
                  type="text"
                  placeholder="Deixe em branco para gerar automaticamente"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <p className="text-sm text-gray-500">
                  Se não informar uma senha, uma senha aleatória será gerada.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button 
                onClick={handlePasswordReset} 
                disabled={isLoading}
              >
                <Key className="mr-2 h-4 w-4" />
                {isLoading ? "Resetando..." : "Resetar Senha"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Nova senha para {usuario.nome}
                </label>
                <div className="flex">
                  <Input
                    type="text"
                    value={generatedPassword}
                    readOnly
                    className="font-mono flex-1"
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="ml-2"
                    onClick={copyToClipboard}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  Esta senha é temporária. Recomende que o usuário a troque no primeiro acesso.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleClose}>
                Fechar
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PasswordResetDialog;
