'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { getMatchingMessage, getProgressDuration } from '@/lib/utils';
import { TAppointment, TMatching } from '@/types/barnabas.types';
import { PrinterIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';

type Props = {
  course: TMatching;
  appointments: TAppointment[];
};

const ReportPopup = ({ course, appointments }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">보고서 생성하기</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[210mm] max-h-[297mm] overflow-auto p-6 bg-white shadow-lg border">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            바나바 과정 SMT 리포트 생성
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <div className="max-w-[210mm] max-h-[297mm] p-[10mm]" ref={contentRef}>
          <h1 className="text-xl font-sans font-semibold border-b pb-1 mb-[10mm]">
            BARNABAS SMT REPORT
          </h1>

          <div className="flex items-end space-x-10">
            {/* 📌 과정 정보 */}
            <div className="w-1/2">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium">📌 과정 정보</h3>
                <span className="text-sm border rounded-full px-3 py-1 font-semibold">
                  {getMatchingMessage(course.status)}
                </span>
              </div>
              <div className="flex border rounded-md divide-x py-2">
                <p className="w-1/2 flex items-center px-4">
                  <span className="inline-block mr-4 text-sm font-semibold">
                    멘티
                  </span>
                  <span>{course.menteeName}</span>
                </p>
                <p className="w-1/2 flex items-center px-4">
                  <span className="inline-block mr-4 text-sm font-semibold">
                    멘토
                  </span>
                  <span>{course.barnabaName}</span>
                </p>
              </div>
              <div className="border rounded-md divide-y mt-[3mm]">
                <div className="flex justify-between items-center px-4 py-2">
                  <p>양육기간</p>
                  <p className="">
                    {getProgressDuration({
                      matchingDate: course.matchingDate,
                      completedDate: course.completedDate,
                      lastMeetingDate: course.lastMeetingDate,
                      completedMeetingCount: course.completedMeetingCount,
                      scheduledMeetingCount: course.scheduledMeetingCount,
                    })}
                    주
                  </p>
                </div>
                <div className="flex justify-between items-center px-4 py-2">
                  <p>진행주차</p>
                  <p className="">
                    {course.completedMeetingCount || 0}주차 /{' '}
                    {course.scheduledMeetingCount}주차
                  </p>
                </div>
              </div>
            </div>

            <div className="w-1/2 border rounded-md divide-y">
              <div className="flex justify-between items-center px-4 py-2">
                <p>매칭일</p>
                <p>{course.matchingDate}</p>
              </div>
              <div className="flex justify-between items-center px-4 py-2">
                <p>완료일</p>
                <p>{course.completedDate || '일정없음'}</p>
              </div>
              <div className="flex justify-between items-center px-4 py-2">
                <p>첫만남</p>
                <p>{course.firstMeetingDate || '일정없음'}</p>
              </div>
              <div className="flex justify-between items-center px-4 py-2">
                <p>마지막만남</p>
                <p>{course.lastMeetingDate || '일정없음'}</p>
              </div>
            </div>
          </div>
          <h3 className="text-lg font-medium mt-6">📝 주차별 나눔</h3>
          <div className="h-[1px] w-full bg-gray-200 mt-2 mb-4" />
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {appointments
              .sort((a, b) => parseInt(a.week) - parseInt(b.week))
              .map((appointment, index) => (
                <div
                  key={index}
                  className="border-b pb-2 col-span-1 break-inside-avoid print:break-before-auto print:pt-3"
                >
                  <p className="font-medium">Week {appointment.week}</p>
                  <p className="text-sm whitespace-pre-wrap">
                    {appointment.review || '리뷰 없음'}
                  </p>
                </div>
              ))}
          </div>
        </div>
        <DialogFooter className="mt-4 flex justify-between">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            닫기
          </Button>
          <div className="flex gap-2">
            <Button onClick={() => reactToPrintFn()} variant="outline">
              <PrinterIcon className="w-4 h-4 mr-2" /> 출력
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportPopup;
