
import { ChangeEvent } from 'react';

export interface LocationSelectProps {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
  control?: any; // Add this to support react-hook-form control prop
  defaultValue?: string; // Add this to support default value
}
