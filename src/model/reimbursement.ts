import { ReimbursementStatus } from './ReimbursementStatus';
import { ReimbursementType } from './ReimbursementType';

export class Reimbursement {
    reimbursementId: number;
    author: number;
    amount: number;
    dateSubmitted: number;
    dateResolved: number;
    description: string;
    resolver: number;
    status: ReimbursementStatus;
    type: ReimbursementType;
    img: string;
    constructor(reimbursementId: number, author: number, amount: number, dateSubmitted: number, dateResolved: number, description: string, resolver: number, status: ReimbursementStatus, type: ReimbursementType, img: string) {
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