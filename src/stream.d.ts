class Effect {
    private cb: () => void;
    private _set: Set<Effect>;
    constructor(cb: () => void);
    public unhook(): void;
}

declare const hook: (cb: () => void) => Effect;

declare const stream: <T>(initialVal: any) => T & { val?: T };