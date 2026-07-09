'use client';

import Image from 'next/image';

export default function Team() {
  const team = [
    {
      name: 'Saroha Siringoringo',
      role: 'Direktur',
      image: '/images/director-portrait.jpg',
      position: 'top',
    },
    {
      name: 'Patar Mangatur Siringoringo',
      role: 'Komisaris',
      image: '/images/commissioner-portrait.jpg',
      position: 'top',
    },
  ];

  return (
    <section className="section section-gradient" id="tim">
      <div className="container">
        <div className="section-header">
          <span className="section-label">👥 Pengurus</span>
          <h2 className="section-title">Tim Kepemimpinan<br />Kami</h2>
          <p className="section-subtitle">
            Dipimpin oleh pengurus yang berpengalaman dan berkomitmen untuk membawa
            perusahaan mencapai standar tertinggi di industri beton.
          </p>
        </div>

        <div className="team-grid">
          {team.map((member, index) => (
            <div className="team-card" key={index}>
              <div className="team-card-avatar">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={140}
                  height={140}
                  style={{ objectFit: 'cover', objectPosition: member.position || 'center' }}
                />
              </div>
              <h3 className="team-card-name">{member.name}</h3>
              <p className="team-card-role">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
