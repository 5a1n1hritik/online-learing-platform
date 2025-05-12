import React from "react";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const PaymentSuccessModal = ({ isOpen, onClose, courseTitle }) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      aria-labelledby="payment-success-title"
      aria-describedby="payment-success-description"
    >
      <DialogContent className="sm:max-w-[425px] animate-fade-in">
        <DialogHeader className="flex flex-col items-center text-center">
          <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3 mb-4 animate-bounce-in">
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <DialogTitle className="text-xl">Payment Successful!</DialogTitle>
          <DialogDescription>
            You have successfully enrolled in{" "}
            <span className="font-medium">{courseTitle}</span>. You can now
            access the course content.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="bg-muted/50 p-4 rounded-md">
            <h4 className="font-medium mb-2">What's Next?</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                Access all course materials and resources
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                Track your progress as you complete lessons
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                Participate in quizzes and exams to test your knowledge
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                Receive a certificate upon course completion
              </li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="sm:flex-1">
            Continue Browsing
          </Button>
          <Link to="/my-courses" className="sm:flex-1">
            <Button className="w-full">Go to My Courses</Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentSuccessModal;
