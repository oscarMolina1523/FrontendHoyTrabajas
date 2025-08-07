import { useState } from 'react';
import { CartItem } from '@/types/api';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, X, CheckCircle, CreditCard } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface CartSidebarProps {
  cartItems: CartItem[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartSidebar({ cartItems, isOpen, onOpenChange }: CartSidebarProps) {
  const [isPaid, setIsPaid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);
  const itemCount = cartItems.length;

  const handlePayment = async () => {
    if (itemCount === 0) return;
    
    setIsProcessing(true);
    
    // Simular procesamiento de pago
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setIsPaid(true);
    
    toast({
      title: "Pago exitoso! 🎉",
      description: `Su orden de $${totalPrice.toFixed(2)} fue procesada correctamente.`,
      duration: 4000,
    });

    // Resetear después de 3 segundos
    setTimeout(() => {
      setIsPaid(false);
    }, 3000);
  };

  const resetCart = () => {
    setIsPaid(false);
    setIsProcessing(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) {
        // Resetear estado cuando se cierra
        setTimeout(() => resetCart(), 300);
      }
    }}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <ShoppingCart className="h-4 w-4" />
          {itemCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
              {itemCount}
            </Badge>
          )}
          <span className="sr-only">Abrir carrito</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-[400px] bg-background flex flex-col h-full">
        <SheetHeader className="space-y-3 flex-shrink-0">
          <SheetTitle className="flex items-center gap-2 text-xl font-semibold">
            <ShoppingCart className="h-5 w-5" />
            Carrito de compras
          </SheetTitle>
          <SheetDescription>
            {itemCount === 0 ? 'Su carrito esta vacio' : `${itemCount} item${itemCount !== 1 ? 's' : ''} en su carrito`}
          </SheetDescription>
        </SheetHeader>
        
        {isPaid ? (
          // Estado de pago exitoso
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 p-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-success to-success/80 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="h-12 w-12 text-success-foreground" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-warning to-warning/80 rounded-full flex items-center justify-center animate-bounce">
                ✨
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-success">
                ¡Pago Exitoso!
              </h3>
              <p className="text-muted-foreground text-lg">
                Tu compra de <span className="font-bold text-success">${totalPrice.toFixed(2)}</span> ha sido procesada
              </p>
              <div className="bg-gradient-to-r from-success/10 to-success/5 border border-success/20 rounded-lg p-4">
                <p className="text-sm text-success font-medium">
                  Recibirás un email de confirmación pronto
                </p>
              </div>
            </div>

            <Button 
              onClick={() => onOpenChange(false)}
              className="w-full bg-success hover:bg-success/90 text-success-foreground"
            >
              Continuar Comprando
            </Button>
          </div>
        ) : itemCount === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">Your carrito esta vacio</p>
            <p className="text-sm text-muted-foreground mt-2">Agregar al menos un producto para empezar!</p>
          </div>
        ) : (
          <>
            {/* Área de scroll para productos */}
            <div className="flex-1 min-h-0">
              <ScrollArea className="h-full pr-4">
                <div className="space-y-4 py-4">
                  {cartItems.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="flex gap-3 p-3 rounded-lg border bg-card">
                      <div className="w-16 h-16 rounded-md overflow-hidden bg-muted/50 shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-card-foreground leading-tight mb-1">
                          {item.name}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-primary">
                            ${item.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            
            {/* Footer fijo con total y botón de pago */}
            <div className="flex-shrink-0 space-y-4 p-4 border-t bg-background">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-xl font-bold text-primary">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                <Button 
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary text-primary-foreground font-medium h-12 text-base shadow-lg"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
                      <span>Procesando Pago...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      <span>Proceder al Pago</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}