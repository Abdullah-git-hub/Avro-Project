import { RuntimeVal } from "./values";

export default class Environment {
    private parent?: Environment;
    private variables: Map<string, RuntimeVal>;

    constructor(parentENV?: Environment) {
        this.parent = parentENV;
        this.variables = new Map();
    }

    public declareVar(varName: string, value: RuntimeVal): RuntimeVal {
        if (this.variables.has(varName)) {
            throw `${varName} চলকটি ইতিমধ্যেই তৈরি করা রয়েছে, পুনরায় তৈরি করা যাবে না`;
        }

        this.variables.set(varName, value);
        return value;
    }

    public assignVar(varName: string, value: RuntimeVal): RuntimeVal {
        const env = this.resolve(varName);
        env.variables.set(varName, value);
        return value;
    }

    public lookupVar(varName: string): RuntimeVal {
        const env = this.resolve(varName);
        return env.variables.get(varName) as RuntimeVal;
    }

    public resolve(varName: string): Environment {
        if (this.variables.has(varName)) {
            return this;
        }

        if (this.parent == undefined) {
            throw `'${varName}' চলকটি সমাধান করা যাচ্ছে না কারণ এটি বিদ্যমান নেই`;
        }

        return this.parent.resolve(varName);
    }
}
