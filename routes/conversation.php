<?php

use App\Http\Controllers\ConversationController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::post('/conversation', [ConversationController::class, 'store'])->name('conversation.store');
    Route::get('/chat/group/{id}', [ConversationController::class, 'show'])->name('conversation.show');
    Route::post('/chat/group/', [ConversationController::class, 'send_message'])->name('conversation.send_message');
    Route::post('/converation', [ConversationController::class, 'add_members'])->name('conversation.add_members');
    Route::delete('/conversation/{id}/{conversationId}', [ConversationController::class, 'leave_group_chat'])
        ->name('conversation.leave-group-chat');
    Route::delete('/conversation/{id}/{conversationId}/delete', [ConversationController::class, 'remove_member_from_group_chat'])->name('conversation.remove-member-from-group-chat');
    Route::put('/conversation/{id}', [ConversationController::class, 'update_conversation_name'])->name('conversation.update_conversation_name');
});