"use client";

import React, { useState } from 'react';
import { Card, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';

type WizardData = {
  field1?: string;
  field2?: string;
  field3?: string;
  field4?: string;
};

const OnboardingWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<WizardData>({});

  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log('Form Submitted:', formData);
      // Handle submission logic here
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateData = (key: keyof WizardData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 data={formData} updateData={updateData} />;
      case 2:
        return <Step2 data={formData} updateData={updateData} />;
      case 3:
        return <Step3 data={formData} updateData={updateData} />;
      case 4:
        return <Step4 data={formData} updateData={updateData} />;
      default:
        return <div>Unknown Step</div>;
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep > index + 1
                    ? 'bg-primary border-primary text-primary-foreground'
                    : currentStep === index + 1
                      ? 'border-primary text-primary'
                      : 'border-muted text-muted-foreground'
                  }`}
              >
                {index + 1}
              </div>
              {index < totalSteps - 1 && (
                <div
                  className={`h-1 w-12 mx-2 ${currentStep > index + 1 ? 'bg-primary' : 'bg-muted'
                    }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <Card>
        {renderStep()}
        <CardFooter className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            Back
          </Button>
          <Button onClick={handleNext}>
            {currentStep === totalSteps ? 'Finish' : 'Next'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OnboardingWizard;
