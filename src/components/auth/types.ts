
import { ChangeEvent } from 'react';

export interface LocationSelectProps {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
}
