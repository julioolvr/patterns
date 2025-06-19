import { StateNode } from "tldraw";

export class BucketTool extends StateNode {
  static override id = "bucket-fill";
  static override initial = "idle";
  static override children = () => [BucketIdle];
}

export class BucketIdle extends StateNode {
  static override id = "idle";

  override onEnter = () => {
    this.editor.setCursor({ type: "cross" });
  };

  override onExit = () => {
    this.editor.setCursor({ type: "default" });
  };

  override onPointerDown = () => {
    // The actual bucket fill logic is handled in PatternShape component
    // This tool just needs to stay active and provide the cursor
    // Let the event bubble up so PatternShape can handle it
  };

  override onCancel = () => {
    this.editor.setCurrentTool("select");
  };
}