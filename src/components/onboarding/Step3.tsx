import React from 'react';
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type WizardData = {
  field1?: string;
  field2?: string;
  field3?: string;
  field4?: string;
};

interface StepProps {
  data: WizardData;
  updateData: (key: keyof WizardData, value: string) => void;
}

const Step3: React.FC<StepProps> = ({ data, updateData }) => {
  return (
    <div className="space-y-4">
      <CardHeader className="px-0">
        <CardTitle>Step 3: Configuration</CardTitle>
        <CardDescription>
          Configure your settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="field3">Field 3</Label>
          <Input
            id="field3"
            placeholder="Enter value"
            value={data.field3 || ''}
            onChange={(e) => updateData('field3', e.target.value)}
          />
        </div>
      </CardContent>
    </div>
  );
};

export default Step3;
