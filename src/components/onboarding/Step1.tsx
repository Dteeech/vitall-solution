import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StepProps {
  data: any;
  updateData: (key: string, value: any) => void;
}

const Step1: React.FC<StepProps> = ({ data, updateData }) => {
  return (
    <div className="space-y-4">
      <CardHeader className="px-0">
        <CardTitle>Step 1: Getting Started</CardTitle>
        <CardDescription>
          Please provide your initial details.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="field1">Field 1</Label>
          <Input
            id="field1"
            placeholder="Enter value"
            value={data.field1 || ''}
            onChange={(e) => updateData('field1', e.target.value)}
          />
        </div>
      </CardContent>
    </div>
  );
};

export default Step1;
