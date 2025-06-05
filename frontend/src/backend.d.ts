import type { Principal } from "@dfinity/principal";
export interface Some<T> {
    _tag: "Some";
    value: T;
}
export interface None {
    _tag: "None";
}
export type Option<T> = Some<T> | None;
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
export declare const createActor: (options?: CreateActorOptions) => Promise<backendInterface>;
export declare const canisterId: string;
export interface backendInterface {
    addMember(arg0: string, arg1: string, arg2: string): Promise<AddMemberResult>;
    getMembers(): Promise<Array<Member>>;
}

