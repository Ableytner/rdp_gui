import { Command } from "./command"; 

export class StartFilterCommand extends Command{
    public execute(data: string): void {
        this.params["start"] = data
    }
}
