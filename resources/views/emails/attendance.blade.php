@component('mail::message')
# Hello!

You are invited to a meeting.

**What:** {{ $title }}

{{ $description }}

**When:** {{ $date }} | {{ $start_time }} - {{ $end_time }}

@component('mail::button', ['url' => $url])
Confirm Attendance
@endcomponent

If you did not request this, no further action is required.
@endcomponent
