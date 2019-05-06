export class Reimbursement{
    reimbursementId: number;
    author: string;
    amount: number;  
    dateSubmitted: string; 
    dateResolved: string;
    description: string; 
    resolver: string; 
    status: string;
    type: string;
    img: string;
    constructor(reimbursementId: number, author: string, amount: number, dateSubmitted: string, dateResolved: string, description: string, resolver: string, status: string, type: string, img: string){
        this.reimbursementId = reimbursementId;
        this.author = author;
        this.amount = amount;
        this.dateSubmitted = dateSubmitted;
        this.dateResolved = dateResolved;
        this.description = description;
        this.resolver = resolver;
        this.status = status;
        this.type = type;
        this.img = img;
    }
}