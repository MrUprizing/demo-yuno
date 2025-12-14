"use client";

import { Zap } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { EditFieldDialog } from "@/components/screens/edit-field-dialog";
import { FieldSelector } from "@/components/screens/field-selector";
import { FormFieldList } from "@/components/screens/form-field-list";
import { FormPreview } from "@/components/screens/form-preview";
import { ColorPickerFormDemo } from "@/components/theme-picker";
import { Button } from "@/components/ui/button";
import If from "@/components/ui/if";
import {
  defaultFieldConfig,
  FORM_LIBRARIES,
  type FormLibrary,
} from "@/constants";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { FormFieldType } from "@/types";

export type FormFieldOrGroup = FormFieldType | FormFieldType[];

export default function FormBuilder() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const [formFields, setFormFields] = useState<FormFieldOrGroup[]>([]);
  const [selectedField, setSelectedField] = useState<FormFieldType | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [themeVars, setThemeVars] = useState<Record<string, string>>({});
  const [selectedLibrary, setSelectedLibrary] = useState<FormLibrary>(() => {
    if (typeof window !== "undefined") {
      return (
        (localStorage.getItem("formLibrary") as FormLibrary) ||
        FORM_LIBRARIES.REACT_HOOK_FORM
      );
    }
    return FORM_LIBRARIES.REACT_HOOK_FORM;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("formLibrary", selectedLibrary);
    }
  }, [selectedLibrary]);

  const addFormField = (variant: string, index?: number) => {
    const newFieldName = `name_${Math.random().toString().slice(-10)}`;

    const { label, description, placeholder } = defaultFieldConfig[variant] || {
      label: "",
      description: "",
      placeholder: "",
    };

    const newField: FormFieldType = {
      checked: true,
      description: description || "",
      disabled: false,
      label: label || newFieldName,
      name: newFieldName,
      onChange: () => {},
      onSelect: () => {},
      placeholder: placeholder || "Placeholder",
      required: true,
      rowIndex: index ?? 0,
      setValue: () => {},
      type: "",
      value: "",
      variant,
    };
    setFormFields([...formFields, newField]);
  };

  const findFieldPath = (
    fields: FormFieldOrGroup[],
    name: string,
  ): number[] | null => {
    const search = (
      currentFields: FormFieldOrGroup[],
      currentPath: number[],
    ): number[] | null => {
      for (let i = 0; i < currentFields.length; i++) {
        const field = currentFields[i];
        if (Array.isArray(field)) {
          const result = search(field, [...currentPath, i]);
          if (result) return result;
        } else if (field.name === name) {
          return [...currentPath, i];
        }
      }
      return null;
    };
    return search(fields, []);
  };

  const updateFormField = (path: number[], updates: Partial<FormFieldType>) => {
    const updatedFields = JSON.parse(JSON.stringify(formFields));
    let current: any = updatedFields;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]] = {
      ...current[path[path.length - 1]],
      ...updates,
    };
    setFormFields(updatedFields);
  };

  const openEditDialog = (field: FormFieldType) => {
    setSelectedField(field);
    setIsDialogOpen(true);
  };

  const handleSaveField = (updatedField: FormFieldType) => {
    if (selectedField) {
      const path = findFieldPath(formFields, selectedField.name);
      if (path) {
        updateFormField(path, updatedField);
      }
    }
    setIsDialogOpen(false);
  };

  const handleSaveForm = async () => {
    if (formFields.length === 0) {
      alert("Please add at least one field");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        formFields,
        themeVars,
      };
      const jsonString = JSON.stringify(payload);
      console.log("Saving form configuration:", jsonString);

      const response = await fetch(
        "https://drinksdepot.online:443/api/payments/style",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: jsonString,
        },
      );

      console.log("Response status:", response.status);

      if (response.ok) {
        console.log("Form saved successfully");
        alert("Form saved successfully!");
      } else {
        console.error("Server error:", response.status);
        alert(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error("Save error:", error);
      alert(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsSaving(false);
    }
  };

  const saveTheme = (newVars: Record<string, string>) => {
    setThemeVars(newVars);
  };

  return (
    <div className="min-h-screen bg-background">
      <If
        condition={formFields.length > 0}
        render={() => (
          <div className="h-screen flex flex-col p-4 gap-4">
            {/* Theme Picker */}
            <div className="flex justify-end">
              <ColorPickerFormDemo onSave={saveTheme} />
            </div>
            {/* Main Content: 3 Columns */}
            <div className="flex-1 overflow-hidden flex gap-4">
              {/* Column 1: Field Selector (Small) */}
              <div className="w-64 border rounded-lg bg-card p-6 overflow-y-auto">
                <FieldSelector addFormField={addFormField} />
              </div>

              {/* Column 2: Form Fields Editor (Large) */}
              <div className="flex-1 border rounded-lg bg-card p-6 overflow-y-auto">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold">Fields</h2>
                    <p className="text-sm text-muted-foreground">
                      Manage and edit your form fields
                    </p>
                  </div>
                  <FormFieldList
                    formFields={formFields}
                    setFormFields={setFormFields}
                    updateFormField={updateFormField}
                    openEditDialog={openEditDialog}
                  />
                </div>
              </div>

              {/* Column 3: Preview (Large) */}
              <div className="flex-1 border rounded-lg bg-card p-6 overflow-y-auto flex flex-col">
                <div className="space-y-4 flex-1">
                  <FormPreview
                    key={JSON.stringify(formFields)}
                    formFields={formFields}
                    selectedLibrary={selectedLibrary}
                    onLibraryChange={() => {}}
                    themeVars={themeVars}
                  />
                </div>
                <Button
                  onClick={handleSaveForm}
                  disabled={isSaving}
                  className="w-full mt-4 rounded-lg"
                  size="lg"
                >
                  <Zap className="mr-2 h-4 w-4" />
                  {isSaving ? "Saving..." : "Save Form"}
                </Button>
              </div>
            </div>
          </div>
        )}
        otherwise={() => (
          <div className="min-h-screen flex flex-col items-center justify-center p-6">
            <div className="text-center space-y-8 mb-8">
              <h1 className="text-4xl font-bold">Create a Form</h1>
              <p className="text-lg text-muted-foreground max-w-sm">
                Select a field type to get started
              </p>
            </div>

            <div className="w-full max-w-sm rounded-lg border bg-card p-8">
              <FieldSelector addFormField={addFormField} />
            </div>

            <Image
              src="oc-thinking.svg"
              alt="Empty state"
              width={150}
              height={150}
              className="opacity-40 mt-12"
            />
          </div>
        )}
      />

      <EditFieldDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        field={selectedField}
        onSave={handleSaveField}
      />
    </div>
  );
}
