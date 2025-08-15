import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Maria Silva",
    age: 32,
    location: "São Paulo, SP",
    rating: 5,
    comment: "Revolucionou minha alimentação! Em 2 meses perdi 8kg seguindo os cardápios. A IA realmente entende minhas necessidades.",
    avatar: "👩‍💼"
  },
  {
    name: "João Santos",
    age: 28,
    location: "Rio de Janeiro, RJ",
    rating: 5,
    comment: "Como pai de família, economizar tempo e dinheiro no mercado era essencial. O WeekFit fez isso acontecer!",
    avatar: "👨‍👩‍👧‍👦"
  },
  {
    name: "Ana Oliveira",
    age: 45,
    location: "Belo Horizonte, MG",
    rating: 5,
    comment: "Sou vegana e sempre tive dificuldade com variedade. Agora tenho receitas diferentes toda semana!",
    avatar: "🌱"
  },
  {
    name: "Carlos Mendes",
    age: 35,
    location: "Porto Alegre, RS",
    rating: 4,
    comment: "Excelente para quem treina! Os cardápios para ganho de massa são perfeitos e super práticos.",
    avatar: "💪"
  },
  {
    name: "Fernanda Costa",
    age: 29,
    location: "Brasília, DF",
    rating: 5,
    comment: "A lista de compras organizada por seção do mercado me fez economizar 40% do tempo nas compras!",
    avatar: "🛒"
  },
  {
    name: "Roberto Lima",
    age: 52,
    location: "Salvador, BA",
    rating: 5,
    comment: "Com diabetes, encontrar receitas adequadas era um desafio. O WeekFit resolveu isso de forma inteligente.",
    avatar: "👨‍⚕️"
  }
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-secondary/10 to-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            O que nossos usuários dizem
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Mais de 10.000 pessoas já transformaram sua alimentação com nossa IA
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-gradient-card p-6 border border-border/50 shadow-card backdrop-blur-sm hover:shadow-premium transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-3">{testimonial.avatar}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.age} anos • {testimonial.location}</p>
                </div>
              </div>
              
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              
              <p className="text-muted-foreground italic">"{testimonial.comment}"</p>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="flex justify-center items-center space-x-2 text-2xl font-bold text-primary">
            <Star className="w-8 h-8 text-yellow-500 fill-current" />
            <span>4.9/5</span>
            <Star className="w-8 h-8 text-yellow-500 fill-current" />
          </div>
          <p className="text-muted-foreground mt-2">Baseado em mais de 5.000 avaliações</p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;