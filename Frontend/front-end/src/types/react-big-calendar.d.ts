declare module "react-big-calendar" {
    import { ComponentType } from "react";

    export interface Event {
        id?: string | number;
        title?: string;
        start: Date;
        end: Date;
        allDay?: boolean;
    }

    export interface SlotInfo {
        start: Date;
        end: Date;
        slots: Date[];
        action: "select" | "click" | "doubleClick";
    }

    export interface CalendarProps {
        events: Event[];
        localizer: any;
        startAccessor?: string;
        endAccessor?: string;
        selectable?: boolean;
        onSelectSlot?: (slotInfo: SlotInfo) => void;
        onSelectEvent?: (event: Event) => void;
        eventPropGetter?: (event: Event) => any;
        style?: React.CSSProperties;
        views?: string[];
        defaultView?: string;
        messages?: Record<string, string>;
    }

    export const Calendar: ComponentType<CalendarProps>;
    export const Views: Record<string, string>;
    export function dateFnsLocalizer(config: any): any;
}
