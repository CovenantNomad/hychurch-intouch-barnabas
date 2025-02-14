'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
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
        </DialogHeader>

        {/* <div className="max-w-[210mm] max-h-[297mm] p-[15mm]" ref={contentRef}>
          <h1 className="text-xl font-sans font-semibold border-b pb-1 mb-[10mm]">
            BARNABAS SMT REPORT
          </h1>
          <div className="grid grid-cols-2 grid-flow-row gap-6 mt-4">
            <div className="border-r pr-6 h-[100mm]">
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
                <div className="flex items-center px-4 py-2">
                  <p className="w-[35%]">진행기간</p>
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
                <div className="flex items-center px-4 py-2">
                  <p className="w-[35%]">진행주차</p>
                  <p className="">
                    {course.completedMeetingCount || 0}주차 /{' '}
                    {course.scheduledMeetingCount}주차
                  </p>
                </div>
              </div>

              <div className="border rounded-md divide-y mt-[3mm]">
                <div className="flex items-center px-4 py-2">
                  <p className="w-[35%]">매칭일</p>
                  <p>{course.matchingDate}</p>
                </div>
                <div className="flex items-center px-4 py-2">
                  <p className="w-[35%]">완료일</p>
                  <p>{course.completedDate || '일정없음'}</p>
                </div>
                <div className="flex items-center px-4 py-2">
                  <p className="w-[35%]">첫만남</p>
                  <p>{course.firstMeetingDate || '일정없음'}</p>
                </div>
                <div className="flex items-center px-4 py-2">
                  <p className="w-[35%]">마지막만남</p>
                  <p>{course.lastMeetingDate || '일정없음'}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              <h3 className="text-lg font-medium mb-2">📝 주차별 나눔</h3>
              <ul className="space-y-3">
                {appointments
                  .sort((a, b) => a.week.localeCompare(b.week))
                  .map((appointment: TAppointment, index: number) => (
                    <li
                      key={index}
                      className="border-b pb-2"
                      style={{
                        pageBreakInside: 'avoid', // 페이지 중간에 잘리지 않게
                        breakInside: 'avoid-page', // 최신 브라우저 지원
                        marginBottom: '10mm',
                      }}
                    >
                      <p className="font-medium">Week {appointment.week}</p>
                      <p className="text-sm whitespace-pre-line">
                        {appointment.review || '작성된 글이 없습니다'}
                      </p>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div> */}
        <div className="max-w-[210mm] max-h-[297mm] p-[15mm]" ref={contentRef}>
          <h1 className="text-xl font-sans font-semibold border-b pb-1 mb-[10mm]">
            BARNABAS SMT REPORT
          </h1>
          <div
            className="grid grid-cols-2 gap-6"
            style={{ gridTemplateAreas: `"info reviews"` }}
          >
            {/* 왼쪽: 과정 정보 + 왼쪽 리뷰 */}
            <div className="flow-root" style={{ gridArea: 'info' }}>
              {/* 📌 과정 정보 */}
              <div className="border-r pr-6 h-[100mm]">
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
                  <div className="flex items-center px-4 py-2">
                    <p className="w-[35%]">진행기간</p>
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
                  <div className="flex items-center px-4 py-2">
                    <p className="w-[35%]">진행주차</p>
                    <p className="">
                      {course.completedMeetingCount || 0}주차 /{' '}
                      {course.scheduledMeetingCount}주차
                    </p>
                  </div>
                </div>

                <div className="border rounded-md divide-y mt-[3mm]">
                  <div className="flex items-center px-4 py-2">
                    <p className="w-[35%]">매칭일</p>
                    <p>{course.matchingDate}</p>
                  </div>
                  <div className="flex items-center px-4 py-2">
                    <p className="w-[35%]">완료일</p>
                    <p>{course.completedDate || '일정없음'}</p>
                  </div>
                  <div className="flex items-center px-4 py-2">
                    <p className="w-[35%]">첫만남</p>
                    <p>{course.firstMeetingDate || '일정없음'}</p>
                  </div>
                  <div className="flex items-center px-4 py-2">
                    <p className="w-[35%]">마지막만남</p>
                    <p>{course.lastMeetingDate || '일정없음'}</p>
                  </div>
                </div>
              </div>

              <div className="border-r pr-6">
                <h3 className="text-lg font-medium mb-2">📝 주차별 나눔</h3>
                {/* 📝 왼쪽 컬럼에 주차별 리뷰 (2의 배수만) */}
                <ul className="space-y-3">
                  {appointments
                    .sort((a, b) => parseInt(a.week) - parseInt(b.week))
                    .slice(0, 2) // 처음 2개만 왼쪽
                    .map((appointment, index) => (
                      <li
                        key={index}
                        className="border-b pb-2 print:pt-3"
                        style={{ breakInside: 'avoid' }}
                      >
                        <p className="font-medium">Week {appointment.week}</p>
                        <p className="text-sm whitespace-pre-wrap">
                          {appointment.review || '리뷰 없음'}
                        </p>
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            {/* 오른쪽: 주차별 리뷰 (홀수 번째만) */}
            <div className="flow-root" style={{ gridArea: 'reviews' }}>
              <ul className="space-y-3">
                {appointments
                  .sort((a, b) => parseInt(a.week) - parseInt(b.week))
                  .slice(2, 5) // 3번째 이후는 오른쪽
                  .map((appointment, index) => (
                    <li
                      key={index}
                      className="border-b pb-2 print:pt-3"
                      style={{ breakInside: 'avoid' }}
                    >
                      <p className="font-medium">Week {appointment.week}</p>
                      <p className="text-sm whitespace-pre-wrap">
                        {appointment.review || '리뷰 없음'}
                      </p>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
          {appointments.length > 5 && (
            <div
              className="grid grid-cols-2 gap-6"
              style={{ gridTemplateAreas: `"info reviews"` }}
            >
              {/* 왼쪽: 과정 정보 + 왼쪽 리뷰 */}
              <div className="flow-root" style={{ gridArea: 'info' }}>
                <ul className="space-y-3 border-r pr-6">
                  {appointments
                    .sort((a, b) => parseInt(a.week) - parseInt(b.week))
                    .slice(5, 7)
                    .map((appointment, index) => (
                      <li
                        key={index}
                        className="border-b pb-2 print:pt-6"
                        style={{ breakInside: 'avoid' }}
                      >
                        <p className="font-medium">Week {appointment.week}</p>
                        <p className="text-sm whitespace-pre-wrap">
                          {appointment.review || '리뷰 없음'}
                        </p>
                      </li>
                    ))}
                </ul>
              </div>
              <div className="flow-root" style={{ gridArea: 'reviews' }}>
                <ul className="space-y-3">
                  {appointments
                    .sort((a, b) => parseInt(a.week) - parseInt(b.week))
                    .slice(7, 10) // 3번째 이후는 오른쪽
                    .map((appointment, index) => (
                      <li
                        key={index}
                        className="border-b pb-2 print:pt-6"
                        style={{ breakInside: 'avoid' }}
                      >
                        <p className="font-medium">Week {appointment.week}</p>
                        <p className="text-sm whitespace-pre-wrap">
                          {appointment.review || '리뷰 없음'}
                        </p>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          )}
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
