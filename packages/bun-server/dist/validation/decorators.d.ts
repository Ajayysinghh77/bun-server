import 'reflect-metadata';
import type { ValidationRuleDefinition, ValidationMetadata } from './types';
/**
 * 通用校验装饰器
 * @param rules - 校验规则
 */
export declare function Validate(...rules: ValidationRuleDefinition[]): ParameterDecorator;
export interface RuleOption {
    message?: string;
}
export declare function IsString(options?: RuleOption): ValidationRuleDefinition;
export declare function IsNumber(options?: RuleOption): ValidationRuleDefinition;
export declare function IsEmail(options?: RuleOption): ValidationRuleDefinition;
export declare function IsOptional(): ValidationRuleDefinition;
export declare function MinLength(min: number, options?: RuleOption): ValidationRuleDefinition;
/**
 * 获取方法参数的验证元数据
 */
export declare function getValidationMetadata(target: object, propertyKey: string | symbol): ValidationMetadata[];
//# sourceMappingURL=decorators.d.ts.map