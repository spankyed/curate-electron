import type React from 'react';
import { useEffect, useRef } from 'react';
import CalendarMain from './components/main';
import './calendar.css';
import { useAtom, useSetAtom } from 'jotai';
import { isSummaryOpenAtom } from '@renderer/core/components/common/paper/tile/summary/store';
import { calendarModelAtomBase, scrollableContainerRefAtom } from './store';
import PageLayout from '@renderer/core/components/layout/page-layout';
import SocketListener from '@renderer/core/hooks/socket-listener';
import { addAlertAtom } from '@renderer/core/components/common/notification/store';
import dayjs from 'dayjs';
import { updateSidebarDataAtom } from '@renderer/core/components/layout/sidebar/dates/store';

const Calendar: React.FC = () => {
  const [, setScrollableContainerRef] = useAtom(scrollableContainerRefAtom);
  const [isOpen, setIsOpen] = useAtom(isSummaryOpenAtom);
  const addAlert = useSetAtom(addAlertAtom);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setScrollableContainerRef(containerRef);
  }, [setScrollableContainerRef]);

  const handleScroll = () => {
    // Logic to close the summary popover on scroll
    if (isOpen) {
      setIsOpen(false);
    }
  };

  const setCalendarModelBase = useSetAtom(calendarModelAtomBase);
  const updateSidebarData = useSetAtom(updateSidebarDataAtom);

  const handleDateStatusUpdate = ({ key, status: newStatus, data }) => {
    if (newStatus === 'error') {
      const id = dayjs(key).format('MM/DD/YYYY');
      addAlert({ message: `There was a problem scraping papers for ${id}`, id });
    }

    setCalendarModelBase((prevModel) => {
      const updatedModel = prevModel.map((item) => {
        if (item.date.value === key) {
          return {
            ...item,
            date: { ...item.date, status: newStatus },
            papers: newStatus === 'complete' ? data : item.papers,
          };
        }
        return item;
      });
      return updatedModel;
    });

    updateSidebarData({ key, status: newStatus, count: data?.length });
  };

  return (
    <PageLayout
      // padding={2}
      compact={false}
      ref={containerRef}
      onScroll={handleScroll}
      className="calendar"
    >
      <CalendarMain />
      <SocketListener
        eventName="date_status"
        handleEvent={handleDateStatusUpdate}
        page="calendar"
      />
    </PageLayout>
  );
};

export default Calendar;
