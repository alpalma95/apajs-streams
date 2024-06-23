declare module '@reactivjs/streams' {
    class Effect {
       private cb: () => void;
       private _set: Set<Effect>;
       constructor(cb: () => void);
       public unhook(): void;
   }
   
    const hook: (cb: () => void) => Effect;
   
    const stream: <T>(initialVal: any) => T & { val: T };
}

