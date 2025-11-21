import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import courses from '../../courses.config';

export default function CourseCard() {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
      gap: '2rem',
      marginTop: '2rem',
      marginBottom: '2rem'
    }}>
      {courses.map((course) => (
        <Link
          key={course.id}
          to={useBaseUrl(`/${course.path}/intro`)}
          style={{
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <div
            style={{
              border: `2px solid ${course.color || '#4285f4'}`,
              borderRadius: '12px',
              padding: '1.5rem',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer',
              backgroundColor: 'var(--ifm-card-background-color)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = `0 8px 16px rgba(0,0,0,0.1)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
              {course.icon}
            </div>
            <h3 style={{ 
              marginTop: '0.5rem', 
              marginBottom: '0.5rem',
              color: course.color || '#4285f4'
            }}>
              {course.name}
            </h3>
            <p style={{ 
              color: 'var(--ifm-color-content-secondary)',
              fontSize: '0.9rem',
              marginBottom: '1rem',
              flexGrow: 1
            }}>
              {course.description}
            </p>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 'auto',
              paddingTop: '1rem',
              borderTop: '1px solid var(--ifm-color-emphasis-200)'
            }}>
              <span style={{ 
                fontSize: '0.85rem',
                color: 'var(--ifm-color-content-secondary)'
              }}>
                {course.level} • {course.duration}
              </span>
              <span style={{ 
                fontSize: '0.85rem',
                color: course.color || '#4285f4',
                fontWeight: 'bold'
              }}>
                Start Course →
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

