/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { json, logging } from '@angular-devkit/core';
import { CommandDescription, Option, SubCommandDescription } from '../models/interface';
export declare function parseJsonSchemaToSubCommandDescription(name: string, jsonPath: string, registry: json.schema.SchemaRegistry, schema: json.JsonObject, logger: logging.Logger): Promise<SubCommandDescription>;
export declare function parseJsonSchemaToCommandDescription(name: string, jsonPath: string, registry: json.schema.SchemaRegistry, schema: json.JsonObject, logger: logging.Logger): Promise<CommandDescription>;
export declare function parseJsonSchemaToOptions(registry: json.schema.SchemaRegistry, schema: json.JsonObject): Promise<Option[]>;
