import type { Command } from "./command"
import { StartFilterCommand } from "./start_filter_command"

class CommandFactory {
    private static readonly registeredCommands: {[key: string]: typeof Command} = {
        'start': StartFilterCommand
    }

    public getCommand(key: string){
        if (key in CommandFactory.registeredCommands){
            return CommandFactory.registeredCommands[key]
        }
    }
}
