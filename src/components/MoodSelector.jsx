import './MoodSelector.css'

const MoodSelector = ({ onMoodSelect }) => {
  const moods = [
    { label: 'anxious', emoji: '😟' },
    { label: 'sad', emoji: '😢' },
    { label: 'angry', emoji: '😠' },
    { label: 'hurt', emoji: '💔' },
    { label: 'confused', emoji: '😕' },
    { label: 'overwhelmed', emoji: '😩' },
    { label: 'fearful', emoji: '😨' },
    { label: 'shame', emoji: '😔' }
  ]

  return (
    <div className="mood-selector">
      <h2>How are you feeling today?</h2>
      <div className="mood-grid">
        {moods.map((mood) => (
          <button
            key={mood.label}
            onClick={() => onMoodSelect(mood)}
            className="mood-button"
          >
            <span className="mood-emoji">{mood.emoji}</span>
            <span className="mood-label">{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default MoodSelector