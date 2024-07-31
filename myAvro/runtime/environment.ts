import { MK_BOOL, MK_NULL, RuntimeVal } from "./values.ts";

function setupScope(env: Environment) {
    env.declareVar("ঠিক", MK_BOOL(true), true);
    env.declareVar("ভুল", MK_BOOL(false), true);
    env.declareVar("কিছুনা", MK_NULL(), true);
}

export default class Environment {
    private parent?: Environment;
    private variables: Map<string, RuntimeVal>;
    private constants: Set<string>;

    constructor(parentENV?: Environment) {
        const global = parentENV ? true : false;
        this.parent = parentENV;
        this.variables = new Map();
        this.constants = new Set();

        if (global) {
            setupScope(this);
        }
    }

    public declareVar(
        varName: string,
        value: RuntimeVal,
        constant: boolean
    ): RuntimeVal {
        if (this.variables.has(varName)) {
            throw `${varName} চলকটি ইতিমধ্যেই তৈরি করা রয়েছে, পুনরায় তৈরি করা যাবে না`;
        }

        this.variables.set(varName, value);
        if (constant) this.constants.add(varName);
        return value;
    }

    public assignVar(varName: string, value: RuntimeVal): RuntimeVal {
        const env = this.resolve(varName);

        if (this.constants.has(varName)) {
            throw `${varName} একটি ধ্রুবক হওয়ায় এর মান পরিবর্তন করা যাবে না`;
        }
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
