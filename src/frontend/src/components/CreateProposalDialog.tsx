import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCreateProposal } from "../hooks/useQueries";

interface CreateProposalDialogProps {
  onCreated?: () => void;
}

export default function CreateProposalDialog({
  onCreated,
}: CreateProposalDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const createProposal = useCreateProposal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Preencha todos os campos");
      return;
    }

    try {
      await createProposal.mutateAsync({
        title: title.trim(),
        content: content.trim(),
      });
      toast.success("Proposta criada com sucesso", {
        description: "A proposta foi submetida para votação TMR",
      });
      setTitle("");
      setContent("");
      setOpen(false);
      onCreated?.();
    } catch {
      toast.error("Erro ao criar proposta", {
        description: "Verifique sua conexão e tente novamente.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="gap-2"
          data-ocid="quorum.create-proposal.trigger"
        >
          <Plus className="w-4 h-4" />
          Nova Proposta
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Criar Proposta Constitucional</DialogTitle>
            <DialogDescription>
              Submeta uma nova proposta para votação TMR 2-de-3
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título da Proposta</Label>
              <Input
                id="title"
                placeholder="Ex: Artigo 2.3 — Domínios Aspirantes"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={createProposal.isPending}
                data-ocid="quorum.create-proposal.title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Conteúdo</Label>
              <Textarea
                id="content"
                placeholder="Descreva a proposta constitucional..."
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={createProposal.isPending}
                data-ocid="quorum.create-proposal.content"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={createProposal.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createProposal.isPending}
              data-ocid="quorum.create-proposal.submit"
            >
              {createProposal.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Criar Proposta
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
