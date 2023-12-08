export class RequiresHigherPlanError extends Error {
    constructor(message = "This action requires higher plan") {
        super(message)
    }
}