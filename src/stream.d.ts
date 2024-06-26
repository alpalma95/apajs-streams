export class Effect {
    private cb: () => void;
    private _set: Set<Effect>;
    constructor(cb: () => void);
    public unhook(): void;
}
   
export const hook: (cb: () => void) => Effect;
   
export const stream: <T>(initialVal: T) => T extends object ? T : { val: T };


