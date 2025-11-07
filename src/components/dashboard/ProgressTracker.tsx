import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ProgressTrackerProps {
  userId: string;
  onProgressAdded: () => void;
}

export const ProgressTracker = ({ userId, onProgressAdded }: ProgressTrackerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    weight: '',
    body_fat_percentage: '',
    muscle_mass: '',
    waist_circumference: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase.from('user_progress').insert({
        user_id: userId,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        body_fat_percentage: formData.body_fat_percentage ? parseFloat(formData.body_fat_percentage) : null,
        muscle_mass: formData.muscle_mass ? parseFloat(formData.muscle_mass) : null,
        waist_circumference: formData.waist_circumference ? parseFloat(formData.waist_circumference) : null,
        notes: formData.notes || null
      });

      if (error) throw error;

      toast({
        title: "Progresso registrado! 📊",
        description: "Suas medidas foram salvas com sucesso"
      });

      setFormData({
        weight: '',
        body_fat_percentage: '',
        muscle_mass: '',
        waist_circumference: '',
        notes: ''
      });
      setIsOpen(false);
      onProgressAdded();
    } catch (error) {
      console.error('Error saving progress:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o progresso",
        variant: "destructive"
      });
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full"
        variant="outline"
      >
        <Plus className="w-4 h-4 mr-2" />
        Registrar Progresso
      </Button>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-accent" />
          Registrar Medidas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                placeholder="75.5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body_fat">% Gordura</Label>
              <Input
                id="body_fat"
                type="number"
                step="0.1"
                value={formData.body_fat_percentage}
                onChange={(e) => setFormData({ ...formData, body_fat_percentage: e.target.value })}
                placeholder="18.5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="muscle">Massa Muscular (kg)</Label>
              <Input
                id="muscle"
                type="number"
                step="0.1"
                value={formData.muscle_mass}
                onChange={(e) => setFormData({ ...formData, muscle_mass: e.target.value })}
                placeholder="55.0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="waist">Cintura (cm)</Label>
              <Input
                id="waist"
                type="number"
                step="0.1"
                value={formData.waist_circumference}
                onChange={(e) => setFormData({ ...formData, waist_circumference: e.target.value })}
                placeholder="80.0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Como você está se sentindo?"
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              Salvar
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
