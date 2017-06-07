"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const ts = require("typescript");
const json_schema_1 = require("@ngtools/json-schema");
const DEFAULT_CONFIG_SCHEMA_PATH = path.join(__dirname, '../../lib/config/schema.json');
class InvalidConfigError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.name = 'InvalidConfigError';
    }
}
class CliConfig {
    constructor(_configPath, schema, configJson, fallbacks = []) {
        this._configPath = _configPath;
        this._config = new (json_schema_1.SchemaClassFactory(schema))(configJson, ...fallbacks);
    }
    get config() { return this._config; }
    save(path = this._configPath) {
        return fs.writeFileSync(path, this.serialize(), 'utf-8');
    }
    serialize(mimetype = 'application/json') {
        return this._config.$$serialize(mimetype);
    }
    alias(path, newPath) {
        return this._config.$$alias(path, newPath);
    }
    get(jsonPath) {
        if (!jsonPath) {
            return this._config.$$root();
        }
        return this._config.$$get(jsonPath);
    }
    typeOf(jsonPath) {
        return this._config.$$typeOf(jsonPath);
    }
    isDefined(jsonPath) {
        return this._config.$$defined(jsonPath);
    }
    deletePath(jsonPath) {
        return this._config.$$delete(jsonPath);
    }
    set(jsonPath, value) {
        this._config.$$set(jsonPath, value);
    }
    static fromJson(content, ...global) {
        const schemaContent = fs.readFileSync(DEFAULT_CONFIG_SCHEMA_PATH, 'utf-8');
        let schema;
        try {
            schema = JSON.parse(schemaContent);
        }
        catch (err) {
            throw new InvalidConfigError(err.message);
        }
        return new CliConfig(null, schema, content, global);
    }
    static fromConfigPath(configPath, otherPath = []) {
        const configContent = fs.existsSync(configPath)
            ? ts.sys.readFile(configPath)
            : '{}';
        const schemaContent = fs.readFileSync(DEFAULT_CONFIG_SCHEMA_PATH, 'utf-8');
        let otherContents = new Array();
        if (configPath !== otherPath[0]) {
            otherContents = otherPath
                .map(path => fs.existsSync(path) && ts.sys.readFile(path))
                .filter(content => !!content);
        }
        let content;
        let schema;
        let others;
        try {
            content = JSON.parse(configContent);
        }
        catch (err) {
            throw new InvalidConfigError('Parsing .angular-cli.json failed. Please make sure your .angular-cli.json'
                + ' is valid JSON. Error:\n' + err);
        }
        try {
            schema = JSON.parse(schemaContent);
            others = otherContents.map(otherContent => JSON.parse(otherContent));
        }
        catch (err) {
            throw new InvalidConfigError(`Parsing Angular CLI schema or other configuration files failed. Error:\n${err}`);
        }
        return new CliConfig(configPath, schema, content, others);
    }
}
exports.CliConfig = CliConfig;
//# sourceMappingURL=/home/travis/build/angular/angular-cli/models/config/config.js.map