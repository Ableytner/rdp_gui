import type { SearchParams } from "@/types/search_params"

export abstract class Command{
    public constructor(protected params: SearchParams){}
    public abstract execute(data: string): void
}
