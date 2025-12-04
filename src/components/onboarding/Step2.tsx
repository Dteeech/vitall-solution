import React from 'react';
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StepProps {
  data: any;
  updateData: (key: string, value: any) => void;
}

const Step2: React.FC<StepProps> = ({ data, updateData }) => {
  return (
    <div className="space-y-4">
      <CardHeader className="px-0">
        <CardTitle>Step 2: More Details</CardTitle>
        <CardDescription>
          Tell us more about your project.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="field2">Field 2</Label>
          <Input
            id="field2"
            placeholder="Enter value"
            value={data.field2 || ''}
            onChange={(e) => updateData('field2', e.target.value)}
          />
        </div>
      </CardContent>
    </div>
  );
};

export default Step2;
