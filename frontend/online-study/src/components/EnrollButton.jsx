import React, { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import PaymentModal from "./PaymentModel";
import PaymentSuccessModal from "./PaymentSuccessModel";
import API from "@/api/axios.js";

const EnrollButton = ({ courseId, courseTitle, courseDetails, className }) => {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const formatPriceINR = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(price);
  };

  useEffect(() => {
    const checkEnrollment = async () => {
      try {
        const response = await API.get(`/courses/my-courses/${courseId}`);
        const enrolledCourses = response?.data?.enrollments || [];

        const isAlreadyEnrolled = enrolledCourses.some(
          (enrollment) => enrollment.courseId === courseId
        );

        setIsEnrolled(isAlreadyEnrolled);
      } catch (err) {
        if (err.response?.status !== 404) {
          toast({
            title: "Could not verify enrollment",
            description:
              "An error occurred while checking your course status. Please try again later.",
            variant: "destructive",
          });
        }
        // If 404, assume not enrolled
        setIsEnrolled(false);
      } finally {
        setLoading(false);
      }
    };

    checkEnrollment();
  }, [courseId, toast]);

  const enrollInCourse = async () => {
    try {
      setIsEnrolling(false);
      const response = await API.post(`/courses/enroll/${courseId}`);
      setIsEnrolled(true);
      toast({
        title: "Successfully enrolled!",
          description: `You have been enrolled in "${courseTitle}". Start learning now!`,
          duration: 5000,
      });
    } catch (err) {
      toast({
        title: "Enrollment Failed",
        description:
          err.response?.data?.message ||
          "We couldn't complete your enrollment. Please try again in a few moments.",
        variant: "destructive",
      });
    } finally {
      setIsEnrolling(false);
    }
  };
  const handlePaymentFailure = () => {
    setShowPaymentModal(false);
    toast({
      title: "Payment Failed",
      description: "We couldn't complete your payment. Please check your connection or payment method and try again.",
      variant: "destructive",
    });
  };

  const handlePaymentSuccess = async () => {
    setShowPaymentModal(false);
    setShowSuccessModal(true);

    // Call enrollInCourse after payment is successful
    await enrollInCourse();
  };

  const handleClick = () => {
    if (isEnrolled || isEnrolling) return;
  
    if (courseDetails.isPaid) {
      setShowPaymentModal(true); // 💰 Paid → show payment modal
    } else {
      enrollInCourse(); // ✅ Free → enroll directly
    }
  };  

  const renderButtonLabel = () => {
    if (loading)
      return (
        <span className="animate-pulse text-muted-foreground">Checking...</span>
      );
    if (isEnrolling) {
      return (
        <>
          <span className="animate-pulse">Enrolling...</span>
          <div className="absolute inset-0 bg-primary/20 animate-pulse"></div>
        </>
      );
    }
    if (isEnrolled) {
      return (
        <>
          <CheckCircle className="mr-2 h-4 w-4" />
          Enrolled
        </>
      );
    }

    const formattedPrice = formatPriceINR(courseDetails.price);
    return `Enroll ${courseDetails.isPaid ? `• ${formattedPrice}` : "Now"}`;
  };

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={isEnrolled || isEnrolling || loading}
        className={`${className} relative overflow-hidden transition-all duration-300`}
        variant={isEnrolled ? "secondary" : "default"}
      >
        {renderButtonLabel()}
      </Button>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handlePaymentSuccess}
        onFailure={handlePaymentFailure}
        courseTitle={courseTitle}
        coursePrice={courseDetails.price || 999}
      />

      {/* Success Modal */}
      <PaymentSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        courseTitle={courseTitle}
      />
    </>
  );
};

export default EnrollButton;
