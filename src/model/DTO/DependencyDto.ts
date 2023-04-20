import { DependencyJson } from '../DependencyJson';

export class DependencyDto {
  private readonly _refersTo: string;
  private readonly _allowed: boolean;
  constructor(json: DependencyJson) {
    this._refersTo = json.refersTo;
    this._allowed = json.allowed;
  }

  get refersTo(): string {
    return this._refersTo;
  }

  get allowed(): boolean {
    return this._allowed;
  }
}
