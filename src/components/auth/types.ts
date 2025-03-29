
import { ChangeEvent } from 'react';
import { Control } from 'react-hook-form';

export interface LocationSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  control?: Control<any>; 
  defaultValue?: string;
  name?: string;
}
