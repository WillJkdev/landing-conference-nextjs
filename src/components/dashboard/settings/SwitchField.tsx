"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SwitchFieldProps {
  id: string;
  name: string;
  label: string;
  defaultChecked: boolean;
}

export function SwitchField({
  id,
  name,
  label,
  defaultChecked,
}: SwitchFieldProps) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id={id}
        name={name}
        checked={checked}
        onCheckedChange={setChecked}
      />
      <input type="hidden" name={name} value={checked ? "on" : "off"} />
      <Label htmlFor={id}>{label}</Label>
    </div>
  );
}
