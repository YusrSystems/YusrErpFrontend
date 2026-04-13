import type { BaseEntity } from "@yusr_systems/core";
import { ChangeDialog, type ChangeDialogProps, FieldGroup } from "@yusr_systems/ui";
import { useState } from "react";
import TabButton from "./tab/tabButton";

export type TabProps = {
  active: boolean;
  icon: any;
  label: string;
  content: React.ReactElement;
};
export type ChangeDialogTabbedProps<T extends BaseEntity> = {
  changeDialogProps: ChangeDialogProps<T>;
  tabs: TabProps[];
};
export default function ChangeDialogTabbed<T extends BaseEntity>({
  changeDialogProps,
  tabs
}: ChangeDialogTabbedProps<T>)
{
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <ChangeDialog<T> { ...changeDialogProps }>
      <div className="flex flex-col h-[80vh]">
        <div className="flex justify-start border-b mb-4 shrink-0 bg-muted/20 rounded-t-lg">
          { tabs.map((tab, i) => (
            <TabButton
              key={ i }
              active={ currentTab === i }
              icon={ tab.icon }
              label={ tab.label }
              onClick={ () => setCurrentTab(i) }
              content={ tab.content }
            />
          )) }
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-2">
          <FieldGroup>{ tabs[currentTab].content }</FieldGroup>
        </div>
      </div>
    </ChangeDialog>
  );
}
