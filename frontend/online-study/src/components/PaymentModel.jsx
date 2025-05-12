import React, { useEffect, useState } from "react";
import { CreditCard, Calendar, Lock, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const PaymentModal = ({
  isOpen,
  onClose,
  onSuccess,
  courseTitle,
  coursePrice,
}) => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const { toast } = useToast();

  const formatPriceINR = (price) => {
    const numericPrice = Number(price);
    if (isNaN(numericPrice)) return "₹0.00";

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(numericPrice);
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setCardNumber("");
    setCardName("");
    setExpiryDate("");
    setCvv("");
    setErrors({});
    setIsProcessing(false);
  };

  const isValidExpiryDate = (value) => {
    if (!/^\d{2}\/\d{2}$/.test(value)) return false;
    const [month, year] = value.split("/").map(Number);
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    return (
      month >= 1 &&
      month <= 12 &&
      (year > currentYear || (year === currentYear && month >= currentMonth))
    );
  };

  const luhnCheck = (card) => {
    const digits = card.replace(/\D/g, "").split("").reverse();
    const sum = digits.reduce((acc, digit, i) => {
      let num = parseInt(digit);
      if (i % 2 === 1) {
        num *= 2;
        if (num > 9) num -= 9;
      }
      return acc + num;
    }, 0);
    return sum % 10 === 0;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!cardName) newErrors.cardName = "Cardholder name is required";

    if (!cardNumber || !luhnCheck(cardNumber.replace(/\s/g, "")))
      newErrors.cardNumber = "Invalid card number";

    if (!expiryDate || !isValidExpiryDate(expiryDate))
      newErrors.expiryDate = "Invalid expiry date";

    if (!cvv || !/^\d{3,4}$/.test(cvv)) newErrors.cvv = "Invalid CVV";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, "");
    const parts = [];

    for (let i = 0; i < cleaned.length && i < 16; i += 4) {
      parts.push(cleaned.substring(i, i + 4));
    }

    return parts.join(" ");
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const handleExpiryDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (value.length > 2) value = `${value.slice(0, 2)}/${value.slice(2)}`;
    setExpiryDate(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Invalid payment details",
        description: "Please check your payment information and try again.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Payment successful!",
        description: `You've successfully enrolled in "${courseTitle}".`,
      });
      onSuccess?.();
      onClose?.();
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] animate-fade-in">
        <DialogHeader>
          <DialogTitle className="text-xl">Complete Your Purchase</DialogTitle>
          <DialogDescription>
            Enter your card details below to securely enroll in this course.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{courseTitle}</h3>
                <p className="text-sm text-muted-foreground">
                  One-time payment
                </p>
              </div>
              <div className="text-xl font-bold">
                {formatPriceINR(coursePrice)}
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Card Number
                </div>
              </Label>
              <Input
                autoFocus
                id="cardNumber"
                placeholder="4242 4242 4242 4242"
                value={cardNumber}
                onChange={handleCardNumberChange}
                maxLength={19}
                disabled={isProcessing}
                className={errors.cardNumber ? "border-red-500" : ""}
              />
              {errors.cardNumber && (
                <p className="text-sm text-red-500 flex items-center mt-1">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.cardNumber}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardName">Name on Card</Label>
              <Input
                id="cardName"
                type="text"
                placeholder="holder Name"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className={errors.cardName ? "border-red-500" : ""}
                disabled={isProcessing}
              />
              {errors.cardName && (
                <p className="text-sm text-red-500 flex items-center mt-1">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.cardName}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Expiry Date
                  </div>
                </Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={handleExpiryDateChange}
                  maxLength={5}
                  className={errors.expiryDate ? "border-red-500" : ""}
                  disabled={isProcessing}
                />
                {errors.expiryDate && (
                  <p className="text-sm text-red-500 flex items-center mt-1">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.expiryDate}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cvv">
                  <div className="flex items-center">
                    <Lock className="h-4 w-4 mr-2" />
                    CVV
                  </div>
                </Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                  maxLength={4}
                  className={errors.cvv ? "border-red-500" : ""}
                  disabled={isProcessing}
                />
                {errors.cvv && (
                  <p className="text-sm text-red-500 flex items-center mt-1">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.cvv}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-muted/50 p-3 rounded-md text-sm flex items-start">
            <Lock className="h-4 w-4 mr-2 mt-0.5 text-primary" />
            <p>Your payment information is encrypted and processed securely.</p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={isProcessing}>
              Cancel
            </Button>
            <Button type="submit" disabled={isProcessing} className="relative">
              {isProcessing ? "Processing..." : "Pay Now"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
