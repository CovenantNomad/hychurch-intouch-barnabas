'use client';

import { getMatchingMessage, getProgressDuration } from '@/lib/utils';
import { TAppointment, TMatching } from '@/types/barnabas.types';

type Props = {
  course: TMatching;
  appointments: TAppointment[];
};

const DownloadPDF = ({ course, appointments }: Props) => {
  return (
    <div
      style={{
        width: '210mm',
        height: '297mm',
        padding: '15mm',
        backgroundColor: '#fff',
        color: '#333',
        fontFamily: 'Arial, sans-serif',
        fontSize: '12px',
        lineHeight: 1.5,
        border: '1px solid #ccc',
        boxShadow: '0 0 5px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        pageBreakAfter: 'always',
      }}
    >
      {/* 헤더 */}
      <h1
        style={{
          fontSize: '20px',
          fontWeight: 'bold',
          textAlign: 'center',
          borderBottom: '2px solid #000',
          paddingBottom: '5mm',
          marginBottom: '10mm',
        }}
      >
        BARNABAS SMT REPORT
      </h1>

      {/* 레이아웃 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '6mm',
          marginTop: '5mm',
        }}
      >
        {/* 왼쪽 - 바나바 정보 */}
        <div
          style={{
            paddingRight: '6mm',
            borderRight: '1px solid #ddd',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '5mm',
            }}
          >
            📌 과정 정보
            <span
              style={{
                fontSize: '10px',
                fontWeight: 'bold',
                border: '1px solid #444',
                borderRadius: '16px',
                padding: '2px 8px',
                backgroundColor: '#f1f1f1',
              }}
            >
              {getMatchingMessage(course.status)}
            </span>
          </div>

          {/* 멘토/멘티 정보 */}
          <div
            style={{
              border: '1px solid #ccc',
              borderRadius: '6px',
              overflow: 'hidden',
              marginBottom: '5mm',
            }}
          >
            <div
              style={{
                display: 'flex',
                padding: '4mm',
                fontSize: '11px',
                borderBottom: '1px solid #eee',
              }}
            >
              <span style={{ fontWeight: 'bold', width: '35%' }}>멘티</span>
              <span>{course.menteeName}</span>
            </div>
            <div
              style={{
                display: 'flex',
                padding: '4mm',
                fontSize: '11px',
              }}
            >
              <span style={{ fontWeight: 'bold', width: '35%' }}>멘토</span>
              <span>{course.barnabaName}</span>
            </div>
          </div>

          {/* 진행 정보 */}
          <div
            style={{
              border: '1px solid #ccc',
              borderRadius: '6px',
              overflow: 'hidden',
              marginBottom: '5mm',
            }}
          >
            <div
              style={{
                display: 'flex',
                padding: '4mm',
                fontSize: '11px',
                borderBottom: '1px solid #eee',
              }}
            >
              <span style={{ fontWeight: 'bold', width: '35%' }}>진행기간</span>
              <span>{getProgressDuration(course)}주</span>
            </div>
            <div
              style={{
                display: 'flex',
                padding: '4mm',
                fontSize: '11px',
              }}
            >
              <span style={{ fontWeight: 'bold', width: '35%' }}>진행주차</span>
              <span>
                {course.completedMeetingCount || 0}주차 /{' '}
                {course.scheduledMeetingCount}주차
              </span>
            </div>
          </div>

          {/* 날짜 정보 */}
          <div
            style={{
              border: '1px solid #ccc',
              borderRadius: '6px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                padding: '4mm',
                fontSize: '11px',
                borderBottom: '1px solid #eee',
              }}
            >
              <span style={{ fontWeight: 'bold', width: '35%' }}>매칭일</span>
              <span>{course.matchingDate}</span>
            </div>
            <div
              style={{
                display: 'flex',
                padding: '4mm',
                fontSize: '11px',
              }}
            >
              <span style={{ fontWeight: 'bold', width: '35%' }}>완료일</span>
              <span>{course.completedDate || '일정없음'}</span>
            </div>
          </div>
        </div>

        {/* 오른쪽 - 주차별 리뷰 */}
        <div
          style={{
            overflowY: 'auto',
            maxHeight: '250mm',
          }}
        >
          <h3
            style={{
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '3mm',
            }}
          >
            📝 주차별 나눔
          </h3>
          <ul
            style={{
              padding: 0,
              listStyleType: 'none',
            }}
          >
            {appointments
              .sort((a, b) => a.week.localeCompare(b.week))
              .map((appointment, index) => (
                <li
                  key={index}
                  style={{
                    borderBottom: '1px solid #ddd',
                    paddingBottom: '3mm',
                    marginBottom: '3mm',
                  }}
                >
                  <p
                    style={{
                      fontWeight: 'bold',
                      fontSize: '12px',
                      marginBottom: '1mm',
                    }}
                  >
                    Week {appointment.week}
                  </p>
                  <p
                    style={{
                      fontSize: '11px',
                      color: '#444',
                    }}
                  >
                    {appointment.review || '리뷰 없음'}
                  </p>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DownloadPDF;
