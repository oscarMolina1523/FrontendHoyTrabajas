import { useState } from "react";
import { Product, BudgetOptimizationResult } from "@/types/api";
import { findBestCombination } from "@/lib/budget-optimizer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, Zap, DollarSign } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface BudgetOptimizerProps {
  products: Product[];
}

export function BudgetOptimizer({ products }: BudgetOptimizerProps) {
  const [budget, setBudget] = useState<string>("150");
  const [result, setResult] = useState<BudgetOptimizationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleOptimize = async () => {
    const budgetAmount = parseFloat(budget);
    if (isNaN(budgetAmount) || budgetAmount <= 0) {
      return;
    }

    setIsCalculating(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const optimization = findBestCombination(products, budgetAmount);
    setResult(optimization);
    setIsCalculating(false);
  };

  return (
    <Card className="w-full bg-gradient-to-br from-accent/30 to-accent/10 border-accent/20">
      <CardHeader className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Calculator className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-card-foreground">
              Optimizador de Presupuesto
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Encuentra la mejor combinación de productos dentro de tu
              presupuesto usando algoritmos inteligentes.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label
            htmlFor="budget"
            className="text-sm font-medium text-card-foreground"
          >
            Su presupuesto
          </Label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="budget"
                type="number"
                placeholder="Enter your budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="pl-9 bg-background"
                min="0"
                step="0.01"
              />
            </div>
            <Button
              onClick={handleOptimize}
              disabled={isCalculating || !budget}
              className="bg-primary hover:bg-primary-hover text-primary-foreground px-6"
            >
              {isCalculating ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
                  Calculando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Optimizar
                </div>
              )}
            </Button>
          </div>
        </div>

        {result && (
          <div className="space-y-4">
            <Separator />
            <div className="space-y-4">
              <div className="flex flex-wrap flex-row items-center justify-between">
                <h3 className="text-lg font-semibold text-card-foreground">
                  Combinación Óptima
                </h3>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="font-medium">
                    {result.products.length} items
                  </Badge>
                  <Badge className="bg-success text-success-foreground font-bold">
                    ${result.totalValue.toFixed(2)} / ${budget}
                  </Badge>
                </div>
              </div>

              {result.products.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Ningún producto se ajusta a su presupuesto de ${budget}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {result.products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border/50"
                    >
                      <div className="w-12 h-12 rounded-md overflow-hidden bg-muted/50 shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-card-foreground leading-tight">
                          {product.name}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate">
                          {product.description}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="font-semibold text-primary border-primary/20"
                      >
                        ${product.price}
                      </Badge>
                    </div>
                  ))}

                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div className="text-sm text-muted-foreground">
                      Presupuesto restante:{" "}
                      <span className="font-medium text-card-foreground">
                        ${result.remainingBudget.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-lg font-bold text-primary">
                      Total: ${result.totalValue.toFixed(2)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
