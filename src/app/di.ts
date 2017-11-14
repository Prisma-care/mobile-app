import {InjectionToken, Provider} from '@angular/core';
import {Constant} from '../shared/types';
import {constant} from '../shared/constant';

export const ConstantToken = new InjectionToken<Constant>('constant');

export const ConstantProvider: Provider = {
  provide: ConstantToken,
  useValue: constant
};
