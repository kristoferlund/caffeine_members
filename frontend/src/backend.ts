import { backend as _backend, createActor as _createActor, canisterId as _canisterId } from "declarations/backend";
import { type ActorSubclass } from "@dfinity/agent";
import { _SERVICE } from "declarations/backend/backend.did.d.js";
import type { Principal } from "@dfinity/principal";
export interface Some<T> {
    _tag: "Some";
    value: T;
}
export interface None {
    _tag: "None";
}
export type Option<T> = Some<T> | None;
function some<T>(value: T): Some<T> {
    return {
        _tag: "Some",
        value: value
    };
}
function none(): None {
    return {
        _tag: "None"
    };
}
function isNone<T>(option: Option<T>): option is None {
    return option._tag === "None";
}
function isSome<T>(option: Option<T>): option is Some<T> {
    return option._tag === "Some";
}
function unwrap<T>(option: Option<T>): T {
    if (isNone(option)) {
        throw new Error("unwrap: none");
    }
    return option.value;
}
function candid_some<T>(value: T): [T] {
    return [
        value
    ];
}
function candid_none<T>(): [] {
    return [];
}
function record_opt_to_undefined<T>(arg: T | null): T | undefined {
    return arg == null ? undefined : arg;
}
function extractAgentErrorMessage(error: string): string {
    const errorString = String(error);
    const match = errorString.match(/with message:\s*'([^']+)'/s);
    return match ? match[1] : errorString;
}
export type AddMemberResult = {
    ok: null;
} | {
    err: string;
};
export interface Member {
    updatedDate: Time;
    name: string;
    createdDate: Time;
    surname: string;
    email: string;
}
export type Time = bigint;
import { ActorCallError, type HttpAgentOptions, type ActorConfig, type Agent } from "@dfinity/agent";
export declare interface CreateActorOptions {
    agent?: Agent;
    agentOptions?: HttpAgentOptions;
    actorOptions?: ActorConfig;
}
async function loadConfig(): Promise<{
    backend_host: string;
    backend_canister_id: string;
}> {
    try {
        const response = await fetch("./env.json");
        const config = await response.json();
        return config;
    } catch  {
        const fallbackConfig = {
            backend_host: "undefined",
            backend_canister_id: "undefined"
        };
        return fallbackConfig;
    }
}
export async function createActor(options?: CreateActorOptions): Promise<backendInterface> {
    const config = await loadConfig();
    if (!options) {
        options = {};
    }
    if (config.backend_host !== "undefined") {
        options = {
            ...options,
            agentOptions: {
                ...options.agentOptions,
                host: config.backend_host
            }
        };
    }
    let canisterId = _canisterId;
    if (config.backend_canister_id !== "undefined") {
        canisterId = config.backend_canister_id;
    }
    const actor = _createActor(canisterId, options);
    return new Backend(actor);
}
export const canisterId = _canisterId;
export interface backendInterface {
    addMember(arg0: string, arg1: string, arg2: string): Promise<AddMemberResult>;
    getMembers(): Promise<Array<Member>>;
}
import type { AddMemberResult as _AddMemberResult } from "declarations/backend/backend.did.d.ts";
class Backend implements backendInterface {
    #actor: ActorSubclass<_SERVICE>;
    constructor(actor: ActorSubclass<_SERVICE>){
        this.#actor = actor;
    }
    async addMember(arg0: string, arg1: string, arg2: string): Promise<AddMemberResult> {
        try {
            const result = await this.#actor.addMember(arg0, arg1, arg2);
            return from_candid_AddMemberResult_n1(result);
        } catch (e) {
            if (e && typeof e === "object" && "message" in e) {
                throw new Error(extractAgentErrorMessage(e["message"] as string));
            } else throw e;
        }
    }
    async getMembers(): Promise<Array<Member>> {
        try {
            const result = await this.#actor.getMembers();
            return result;
        } catch (e) {
            if (e && typeof e === "object" && "message" in e) {
                throw new Error(extractAgentErrorMessage(e["message"] as string));
            } else throw e;
        }
    }
}
function from_candid_AddMemberResult_n1(value: _AddMemberResult): AddMemberResult {
    return from_candid_variant_n2(value);
}
function from_candid_variant_n2(value: {
    ok: null;
} | {
    err: string;
}): {
    ok: null;
} | {
    err: string;
} {
    return "ok" in value ? {
        ok: value.ok
    } : "err" in value ? {
        err: value.err
    } : value;
}

