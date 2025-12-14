/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <x> */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { RenderFormField } from "@/components/screens/render-form-field";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import type { FormFieldType } from "@/types";

export default function Page() {
  const [themeVars, setThemeVars] = useState<Record<string, string>>({});
  const [apiResponse, setApiResponse] = useState<string>("");
  const [formFields, setFormFields] = useState<FormFieldType[]>([]);

  useEffect(() => {
    handleApiRequest(); // Fetch form fields on mount
  }, []);

  // Apply theme variables to the card container
  useEffect(() => {
    if (Object.keys(themeVars).length > 0) {
      const container = document.getElementById("themed-card-container");
      if (container) {
        Object.entries(themeVars).forEach(([key, value]) => {
          container.style.setProperty(key, value);
        });
      }
    }
  }, [themeVars]);

  const handleApiRequest = async () => {
    try {
      const response = await fetch(
        "https://drinksdepot.online:443/api/payments/style",
      );
      const data = await response.json();
      setApiResponse(JSON.stringify(data, null, 2));

      // Handle new structure with formFields and themeVars
      if (data.formFields && data.themeVars) {
        setFormFields(data.formFields);
        setThemeVars(data.themeVars);
        toast.success("Estilos cargados correctamente");
      } else if (Array.isArray(data)) {
        // Backward compatibility: old format was just an array
        setFormFields(data);
      } else {
        console.error("API response format not recognized");
      }
    } catch (error) {
      setApiResponse(`Error: ${error}`);
    }
  };

  const schema = z.object({
    email: z.string().email(),
  });

  const form = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-4">
      <div id="themed-card-container" className="w-full flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Checkout</CardTitle>
            <CardDescription>Complete your payment</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((data) => console.log(data))}
                className="space-y-4"
              >
                {formFields.map((field) => (
                  <RenderFormField key={field.name} field={field} />
                ))}
                <Button type="submit" className="w-full">
                  Submit
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
