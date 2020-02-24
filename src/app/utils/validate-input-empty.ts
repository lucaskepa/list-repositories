import { FormControl } from '@angular/forms';

export function inputIsEmpty({value}: FormControl): boolean {
    if (!value) {
        return true;
    }
    return value.trim().length === 0;
}
