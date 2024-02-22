export class Utilities {
    /*verifica che la mail sia in formato corretto*/
    static validateEmail(value: string) {
        //let res = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let res = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        return res.test(value);
    }
    /*verifica che ci siano 8-15 caratteri, una lettera minuscola, una lettera maiuscola,
     un numero e un carattere speciale*/
    static validatePassword(value: string) {
        let res = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
        return res.test(value);
    }
}