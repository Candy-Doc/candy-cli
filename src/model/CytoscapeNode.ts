import {CytoscapePattern} from "../tools/adapter/CytoscapePattern";
import {CytoscapeNodeDto} from "./DTO/CytoscapeNodeDto";

export class CytoscapeNode {
  get classes(): CytoscapePattern {
    return this._classes;
  }
  get id(): string {
    return this._id;
  }
  private readonly _id: string;
  private readonly _label: string;
  private _parent?: string;
  private _warnings: Array<string>;
  private _errors: Array<string>;
  private readonly _classes: CytoscapePattern;

  constructor(id: string, label: string, classes: CytoscapePattern) {
    this._id = id;
    this._label = label;
    this._classes = classes;
    this._errors = new Array<string>();
    this._warnings = new Array<string>();
  }
  set parent(value: string) {
    this._parent = value;
  }
  public addWarning(warningCode: string) {
    this._warnings.push(warningCode);
  }
  public addError(errorCode: string) {
    this._errors.push(errorCode);
  }

  public toDto(): CytoscapeNodeDto {
    return {
      classes: this.classes,
      data: {
        id: this._id,
        label: this._label,
        parent: this._parent,
        errors: this._errors.length > 0 ? this._errors : undefined,
        warnings: this._warnings.length > 0 ? this._warnings : undefined,
      },
    };
  }
}
